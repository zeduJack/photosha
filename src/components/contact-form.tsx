'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations, useLocale } from 'next-intl'
import * as Select from '@radix-ui/react-select'
import { Turnstile } from '@marsidev/react-turnstile'
import type { ContactFormData, SessionType } from '@/types/contact'

const FIELD_CLASS =
  'w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] font-body text-[var(--font-size-body)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-text-primary)] transition-colors duration-200'

const ERROR_CLASS = 'mt-1 font-body text-[var(--font-size-caption)] text-[var(--color-error)]'

type FormValues = Omit<ContactFormData, 'turnstileToken'>

export function ContactForm() {
  const t = useTranslations('contact')
  const locale = useLocale()
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [submittedName, setSubmittedName] = useState('')
  const turnstileToken = useRef<string>('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) => {
    setStatus('sending')
    setSubmittedName(data.name)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          turnstileToken: turnstileToken.current,
          locale,
        }),
      })
      const json = await res.json()
      setStatus(json.success ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" aria-live="polite" className="py-12 text-center">
        <p className="font-display text-[var(--font-size-h3)] text-[var(--color-text-primary)]">
          {t('success', { name: submittedName.split(' ')[0] })}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block mb-1 font-body text-[var(--font-size-label)] font-medium uppercase tracking-[var(--letter-spacing-wide)] text-[var(--color-text-secondary)]">
          {t('name')}
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          aria-required="true"
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={FIELD_CLASS}
          {...register('name', { required: true })}
        />
        {errors.name && (
          <p id="name-error" className={ERROR_CLASS}>
            {t('name')} ist erforderlich / required
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block mb-1 font-body text-[var(--font-size-label)] font-medium uppercase tracking-[var(--letter-spacing-wide)] text-[var(--color-text-secondary)]">
          {t('email')}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-required="true"
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={FIELD_CLASS}
          {...register('email', {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          })}
        />
        {errors.email && (
          <p id="email-error" className={ERROR_CLASS}>
            Gültige E-Mail / Valid email required
          </p>
        )}
      </div>

      {/* Session type — Radix Select */}
      <div>
        <label id="session-type-label" className="block mb-1 font-body text-[var(--font-size-label)] font-medium uppercase tracking-[var(--letter-spacing-wide)] text-[var(--color-text-secondary)]">
          {t('sessionType')}
        </label>
        <input
          type="hidden"
          {...register('sessionType', { required: true })}
        />
        <Select.Root
          onValueChange={(val) => setValue('sessionType', val as SessionType, { shouldValidate: true })}
        >
          <Select.Trigger
            aria-labelledby="session-type-label"
            aria-required="true"
            className={`${FIELD_CLASS} flex items-center justify-between data-[placeholder]:text-[var(--color-text-tertiary)]`}
          >
            <Select.Value placeholder={t('sessionType')} />
            <Select.Icon className="ml-2 opacity-50">▾</Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="z-50 bg-[var(--color-background)] border border-[var(--color-border)] shadow-lg">
              <Select.Viewport className="p-1">
                {(Object.keys(t.raw('sessionTypes')) as SessionType[]).map((key) => (
                  <Select.Item
                    key={key}
                    value={key}
                    className="px-4 py-2 font-body text-[var(--font-size-body)] text-[var(--color-text-primary)] cursor-pointer hover:bg-[var(--color-surface)] focus:outline-none focus:bg-[var(--color-surface)]"
                  >
                    <Select.ItemText>{t(`sessionTypes.${key}`)}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        {errors.sessionType && (
          <p className={ERROR_CLASS}>Session type required</p>
        )}
      </div>

      {/* Approximate date — optional */}
      <div>
        <label htmlFor="approxDate" className="block mb-1 font-body text-[var(--font-size-label)] font-medium uppercase tracking-[var(--letter-spacing-wide)] text-[var(--color-text-secondary)]">
          {t('approximateDate')}
          <span className="ml-1 normal-case text-[var(--color-text-tertiary)]">(optional)</span>
        </label>
        <input
          id="approxDate"
          type="text"
          className={FIELD_CLASS}
          {...register('approximateDate')}
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block mb-1 font-body text-[var(--font-size-label)] font-medium uppercase tracking-[var(--letter-spacing-wide)] text-[var(--color-text-secondary)]">
          {t('message')}
        </label>
        <textarea
          id="message"
          rows={5}
          aria-required="true"
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={`${FIELD_CLASS} resize-y`}
          {...register('message', { required: true })}
        />
        {errors.message && (
          <p id="message-error" className={ERROR_CLASS}>
            {t('message')} ist erforderlich / required
          </p>
        )}
      </div>

      {/* Turnstile */}
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          onSuccess={(token) => { turnstileToken.current = token }}
          onExpire={() => { turnstileToken.current = '' }}
        />
      )}

      {/* Inline error */}
      {status === 'error' && (
        <div role="alert" aria-live="assertive" className="p-4 bg-[var(--color-surface)] border border-[var(--color-error)]">
          <p className="font-body text-[var(--font-size-body)] text-[var(--color-text-primary)]">
            {t('error')}{' '}
            <a
              href={`mailto:${t('fallbackEmail')}`}
              className="underline"
            >
              {t('fallbackEmail')}
            </a>
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="self-start bg-[var(--color-text-primary)] text-white font-body font-medium text-[11px] tracking-[var(--letter-spacing-wider)] uppercase px-10 py-4 hover:bg-[var(--color-accent-hover)] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
      >
        {status === 'sending' ? t('sending') : t('submit')}
      </button>
    </form>
  )
}
